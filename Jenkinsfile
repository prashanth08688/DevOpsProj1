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
        pollSCM('H/2 * * * *')   // Poll every 2 minutes (or use GitHub webhook)
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH_NAME}", 
                    url: 'https://github.com/prashanth08688/DevOpsProj1.git',
                    credentialsId: 'github_creds'

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

                echo "🔨 Building application..."
                sh 'npm install'

                echo "Building project..."
                // Example: sh 'mvn clean install'

            }
        }

        stage('Test') {
            steps {

                echo "🧪 Running tests..."
                sh 'npm test'
            }
        }

        stage('Approval for Merge') {
            steps {
                script {
                    input message: "✅ Tests passed! Approve merge into main branch manually on GitHub."
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

                echo "Running tests..."
                // Example: sh 'mvn test'
            }
        }
    }

}
