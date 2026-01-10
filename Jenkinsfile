
pipeline {
    agent any
    stages {
        stage('Arreter les container en cours') {
            steps {
                script {
                    sh 'docker stop direct_post_front || true'
                    sh 'docker rm direct_post_front -f || true'
                }
            }
        }
        stage('Build and Run Container') {
            steps {
                script {
                    sh 'docker build --tag direct_post_front .'
                    sh 'docker run -d --name direct_post_front -p 8082:8082 direct_post_front'
                }
            }
        }
    }
}
