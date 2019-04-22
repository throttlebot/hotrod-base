import os, yaml

def yaml_to_dict(document):
    with open(document, 'r') as f:
        specs = f.read().split("---")
    for spec in specs:
        yield yaml.load(spec)

def kind_search(keyword, specs):
    for d in specs:
        if d['kind'] == keyword:
            return d

def dict_to_yaml(spec, document):
    try:
        parents = document.split("/")
        parents = "/".join(parents[:len(parents) - 1])
        if len(parents):
            os.makedirs(parents)
    except OSError:
        pass
    with open(document, 'w+') as f:
        f.write(yaml.dump(spec))

def replace_by_string(spec, key, value):
    split_key = key.split('.')
    replace_by_list(spec, split_key, value)

def replace_by_list(spec, split_key, value):
    for k in split_key[:len(split_key) - 1]:
        if k[-1] == ']':
            index = int(k[k.index('[') + 1:len(k)-1])
            k = k[:k.index('[')]
        else:
            index = None
        spec = spec[k]
        if index is not None:
            spec = spec[index]
    spec[split_key[-1]] = value

def kubectl_cmd(cmd, args, value=None):
    for k, v in args.items():
        cmd += " -{} {}".format(k, v)
    if value is not None:
        cmd += " " + value
    os.system("kubectl " + cmd)