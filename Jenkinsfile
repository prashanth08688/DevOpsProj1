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
        pollSCM('H/2 * * * *')   // Poll every 2 minutes
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
                echo "🔨 Building app on Windows..."
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo "🧪 No tests defined, skipping..."
            }
        }

        stage('Approval for Merge') {
            steps {
                script {
                    input message: "✅ Build passed! Approve merge into main branch manually on GitHub."
                }
            }
        }
    }

    post {
        success {
            echo "🎉 CI pipeline passed on dev branch. Please create/approve Pull Request to main."
        }
        failure {
            echo "❌ Pipeline failed. Fix issues before merging."
        }
    }
}
