#!/usr/bin/env groovy

pipeline {

  agent any
  environment {
    APP_ENV_FILE = credentials('draft-theme-env')
    DOCKER_CMD = "docker exec -i ${THEME_CONTAINER_NAME} sh -c"
    NODE_CONTAINER_NAME = "draft-theme-node-${GIT_COMMIT.take(8)}_${BUILD_NUMBER}"
    NODE_BUILD_CONTAINER_NAME = "draft-theme-node-build-${GIT_COMMIT.take(8)}_${BUILD_NUMBER}"
    PREVIEW_ID = credentials('draft-theme-preview-id')
    PREVIEW_URL = credentials('draft-theme-preview-url')
    THEME_CONTAINER_NAME = "draft-theme-theme-${GIT_COMMIT.take(8)}_${BUILD_NUMBER}"
  }
  stages {
    stage('Prepare') {
      steps {
        echo 'Run npm install'
        sh """
           docker run --rm --name ${NODE_CONTAINER_NAME} \\
           -v /home/jenkins/.ssh:/home/jenkins/.ssh \\
           -v /home/jenkins/.npm:/home/jenkins/.npm \\
           -v `pwd`:/home/jenkins/workspace \\
           hub.bystrov.agency/ci/node:latest \\
           npm install
           """
      }
    }
    stage('Build') {
      steps {
        echo 'Building app'
        sh """	
           docker run --rm --name ${NODE_BUILD_CONTAINER_NAME} \\
           -v /home/jenkins/.ssh:/home/jenkins/.ssh \\
           -v /home/jenkins/.npm:/home/jenkins/.npm \\
           -v `pwd`:/home/jenkins/workspace \\
           -w /home/jenkins/workspace \\
           hub.bystrov.agency/ci/node:latest \\
           npm run js:css
           """
      }
    }
    stage('Deploy') {
      when {
        branch 'master'
      }
      steps {
        slackSend(
            channel: "notif-deploys",
            color: "#33BBFF",
            message: "*draft-theme* deploy(#${BUILD_NUMBER}) started. <${env.RUN_DISPLAY_URL}|View progress>"
        )
        echo 'Deploying'
        sh """
           docker run --rm --name ${THEME_CONTAINER_NAME} \\
           -v /home/jenkins/.ssh:/home/jenkins/.ssh \\
           -v /home/jenkins/.npm:/home/jenkins/.npm \\
           -v `pwd`:/home/jenkins/workspace \\
           -v ${APP_ENV_FILE}:/home/jenkins/workspace/.env \\
           -w /home/jenkins/workspace/src \\
           hub.bystrov.agency/ci/themekit:latest \\
           theme deploy --vars='../.env'
           """
      }
      post {
        success {
          slackSend(
              channel: "notif-deploys",
              color: "good",
              message: "*draft-theme* deploy(#${BUILD_NUMBER}) finished. <https://${PREVIEW_URL}/?preview_theme_id=${PREVIEW_ID}|Open preview>"
          )
        }
      }
    }
  }

  post {
    always {
      echo 'Removing containers'
      sh "docker stop ${NODE_CONTAINER_NAME} || true"
      sh "docker stop ${NODE_BUILD_CONTAINER_NAME} || true"
    }
  }
}
