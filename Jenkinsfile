pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        BRANCH_NAME = "dev"
    }

    triggers {
        pollSCM('H/2 * * * *')   // Check every 2 minutes
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH_NAME}", 
                    url: 'https://github.com/prashanth08688/DevOpsProj1.git',
                    credentialsId: 'github_creds'
            }
        }

        stage('Build') {
            steps {
                echo "🔨 Building application..."
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo "🧪 Running tests..."
                sh 'npm test'
            }
        }
    }

    post {
        success {
            echo "🎉 CI pipeline passed on dev branch!"
        }
        failure {
            echo "❌ Pipeline failed. Please fix before merging."
        }
    }
}
