pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev',
                    credentialsId: 'github_creds',
                    url: 'https://github.com/prashanth08688/DevOpsProj1.git'
            }
        }

        stage('Build') {
            steps {
                echo "Building the application..."
                // Example: sh 'mvn clean install'
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                // Example: sh 'mvn test'
            }
        }

        stage('Approval for Merge') {
            steps {
                input message: 'Approve to merge into main?', ok: 'Merge'
            }
        }
    }
}
