pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'cicd',
                    credentialsId: 'github_creds',
                    url: 'https://github.com/your-org/your-repo.git'
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
