pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'cicd',
                    credentialsId: 'github_creds',
                    url: 'https://github.com/prashanth08688/DevOpsProj1.git'
            }
        }

        stage('Build') {
            steps {
                echo "Building project..."
                // Example: sh 'mvn clean install'
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                // Example: sh 'mvn test'
            }
        }
    }
}
