#!/usr/bin/env groovy

pipeline {

  agent any
  environment {
    APP_ENV_FILE = credentials('alginc-dev-config')
    DOCKER_CMD = "docker exec -i ${THEME_CONTAINER_NAME} sh -c"
    NODE_CONTAINER_NAME = "alginc-dev-node-${GIT_COMMIT.take(8)}_${BUILD_NUMBER}"
    NODE_BUILD_CONTAINER_NAME = "alginc-dev-node-build-${GIT_COMMIT.take(8)}_${BUILD_NUMBER}"
    PREVIEW_ID = credentials('levian-dev-preview-id')
    PREVIEW_URL = credentials('levian-dev-preview-url')
    THEME_CONTAINER_NAME = "alginc-dev-theme-${GIT_COMMIT.take(8)}_${BUILD_NUMBER}"
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
           -v ${APP_ENV_FILE}:/home/jenkins/workspace/config.yml \\
           -w /home/jenkins/workspace/app \\
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
           -v ${APP_ENV_FILE}:/home/jenkins/workspace/config.yml \\
           -w /home/jenkins/workspace/app \\
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
            message: "*alginc-dev* deploy(#${BUILD_NUMBER}) started. <${env.RUN_DISPLAY_URL}|View progress>"
        )
        echo 'Deploying'
        sh """
           docker run --rm --name ${THEME_CONTAINER_NAME} \\
           -v /home/jenkins/.ssh:/home/jenkins/.ssh \\
           -v /home/jenkins/.npm:/home/jenkins/.npm \\
           -v `pwd`:/home/jenkins/workspace \\
           -v ${APP_ENV_FILE}:/home/jenkins/workspace/config.yml \\
           hub.bystrov.agency/ci/themekit:latest \\
           theme deploy --env=development
           """
      }
      post {
        success {
          slackSend(
              channel: "notif-deploys",
              color: "good",
              message: "*alginc-dev* deploy(#${BUILD_NUMBER}) finished. <https://${PREVIEW_URL}/?preview_theme_id=${PREVIEW_ID}|Open preview>"
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
      sh "docker stop ${THEME_CONTAINER_NAME} || true"
    }
  }
}
