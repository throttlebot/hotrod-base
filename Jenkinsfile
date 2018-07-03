node {  
    checkout scm
    stage('Build') { 
        def image = docker.build("willwangkelda/hotrod-seed:${env.GIT_COMMIT}")
	image.push()  
    }
    stage('Test') { 
        // 
    }
    stage('Deploy') { 
        // 
    }
}
