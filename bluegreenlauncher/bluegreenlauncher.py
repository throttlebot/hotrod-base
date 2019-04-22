import time
from utils import *

class BlueGreenLaunch:
    """
    A BlueGreenLauncher creates a blue-green deployment, where you can have two separate live
    deployments: blue and green for the same service. While only one deployment is active at
    any given time, the service can switch between using either deployments instantaneously.

    deployment_spec and service_spec are the relative paths to the original deployment and its
    service. It is ideal but not necessary to separate deployments and services into separate
    YAMLs.

    The function create_new_deployment takes in changes, a dictionary of updated or new YAML
    mappings. Delete mappings by setting them to None. See the __main__ function for an example
    of how this class is used.
    """

    def __init__(self, deployment_spec, service_spec):
        self.state = "old"
        self.deployment_spec = deployment_spec
        self.service_spec = service_spec
        self.original_deployment = None
        self.new_deployment = None
        self.original_service = None
        self.new_service = None

    def create_new_deployment(self, changes):
        assert self.state == "old"

        target_deployment = kind_search("Deployment", yaml_to_dict(self.deployment_spec))
        for k, v in changes.items():
            replace_by_string(target_deployment, k, v)
        deployment_hash = str(abs(hash(str(target_deployment))))
        replace_by_string(target_deployment, "spec.template.metadata.labels.appName", deployment_hash)
        replace_by_string(target_deployment, "metadata.name",
                          target_deployment['metadata']['name'] + "-" + deployment_hash)
        dict_to_yaml(target_deployment, "tmp/{}.yaml".format(deployment_hash))

        self.new_deployment = {
            "path": "tmp/{}.yaml".format(deployment_hash),
            "hash": deployment_hash,
            "spec": target_deployment,
        }
        self.original_deployment = {
            "path": self.deployment_spec,
            "hash": None,
            "spec": kind_search('Deployment', yaml_to_dict(self.deployment_spec)),
        }

    def create_service_for_new_deployment(self):
        assert self.state == "old"

        target_service = kind_search("Service", yaml_to_dict(self.service_spec))
        replace_by_string(target_service, "spec.selector.appName", self.new_deployment["hash"])
        service_hash = str(abs(hash(str(target_service))))
        dict_to_yaml(target_service, "tmp/{}.yaml".format(service_hash))
        self.new_service = {
            "path": "tmp/{}.yaml".format(service_hash),
            "hash": service_hash,
            "spec": target_service,
        }
        self.original_service = {
            "path": self.service_spec,
            "hash": None,
            "spec": kind_search("Service", yaml_to_dict(self.service_spec))
        }

    def deploy_new_deployment(self):
        kubectl_cmd("apply", {"f": self.new_deployment["path"]})

    def deploy_old_deployment(self):
        kubectl_cmd("apply", {"f": self.original_deployment["path"]})

    def delete_new_deployment(self):
        assert self.state != "new"
        kubectl_cmd("delete deployment", {
            "n": self.new_deployment["spec"]["metadata"]["namespace"]
        }, self.new_deployment["spec"]["metadata"]["name"])

    def delete_old_deployment(self):
        assert self.state != "old"
        kubectl_cmd("delete deployment", {
            "n": self.original_deployment["spec"]["metadata"]["namespace"]
        }, self.original_deployment["spec"]["metadata"]["name"])

    def switch_to_new_deployment(self):
        assert self.state != "new"
        kubectl_cmd("apply", {"f": self.new_service["path"]})
        self.state = "new"

    def switch_to_old_deployment(self):
        assert self.state != "old"
        kubectl_cmd("apply", {"f": self.original_service["path"]})
        self.state = "old"

    def clear_state(self):
        self.original_deployment = None
        self.new_deployment = None
        self.original_service = None
        self.new_service = None


if __name__ == '__main__':
    """
    An example of how to use the blue green launcher to create and switch to a new deployment.
    This works best when deployments and services are declared in separate YAML files.

    Between Step 2 and Step 4, visiting the ingress should display a subtitle saying 'Rides by Scott'
    instead of 'Rides by Will'.
    """
    changes = {
        'spec.template.spec.containers[0].image': 'hantaowang/frontend:part2' # Change the image of the nginx frontend
    }
    bgl = BlueGreenLaunch("../../hotrod-frontend/manifests/nginx.yaml", "../../hotrod-frontend/manifests/nginx.yaml")

    print("1) Create and deploy modified deployment.")
    bgl.create_new_deployment(changes)
    bgl.create_service_for_new_deployment()
    bgl.deploy_new_deployment()
    time.sleep(10)

    print("2) Switch service to new deployment and delete original deployment")
    bgl.switch_to_new_deployment()
    bgl.delete_old_deployment()
    time.sleep(10)

    print("3) Redeploy original deployment")
    bgl.deploy_old_deployment()
    time.sleep(10)

    print("4) witch service to original deployment and delete new deployment")
    bgl.switch_to_old_deployment()
    bgl.delete_new_deployment()
    bgl.clear_state()