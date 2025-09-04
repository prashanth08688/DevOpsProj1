pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')   // Poll every 2 minutes
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev', 
                    url: 'https://github.com/prashanth08688/DevOpsProj1.git',
                    credentialsId: 'github_creds'
            }
        }

        stage('Build') {
            steps {
                echo "🔨 Building app on Windows..."
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                bat 'npm test'
            }
        }
    }
}
