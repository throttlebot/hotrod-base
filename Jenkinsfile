pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                docker build -t willwangkelda/hotrod-seed:$GIT_COMMIT .
                docker push willwangkelda/hotrod-seed:$GIT_COMMIT 
            }
        }
    }
}
