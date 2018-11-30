pipeline {
  agent {
    label 'base-template'
  }
  stages {
    stage('Prepare Environment') {
      steps {
        echo 'Doing a yarn install'
        sh 'yarn install'
        echo 'Setting AWS Credentials in files at ~/.aws for the CLI to use'
        withCredentials(bindings: [[$class: 'UsernamePasswordMultiBinding', credentialsId: '7306312f-5257-43bc-8109-923c956df9c1', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
          sh 'mkdir -p ~/.aws'
          sh '''printf \'%s
\' \'[default]\' \'output = json\' \'region = us-east-1\' > ~/.aws/config'''
          sh '''printf \'%s
\' \'[default]\' "aws_access_key_id = $USERNAME" "aws_secret_access_key = $PASSWORD" > ~/.aws/credentials'''
        }

      }
    }
    stage('Test') {
      steps {
        echo 'Re-enable tests when they are fixed'
        /* sh '#!/bin/bash \n pushd packages/app; CI=true yarn test:ci; popd'
        junit(testResults: 'junit.xml', healthScaleFactor: 1) */
      }
    }
    stage('Build') {
      steps {
        sh "#!/bin/bash \n pushd packages/app; yarn run build; popd"
      }
    }
    stage('Upload to S3') {
      steps {
        script {
          BUNDLE = sh(returnStdout: true, script: 'echo `expr "$GIT_URL" : \'^.*/request-ce-bundle-\\(.*\\)\\.git$\'`').trim()
          VERSION = env.BRANCH_NAME == "master" ? "v1" : env.BRANCH_NAME
          OPTIONS = '--acl public-read --cache-control="must-revalidate, max-age: 0" --delete'
          sh "aws s3 sync packages/app/build s3://kinops.io/bundles/hydrogen/${BUNDLE}/${VERSION} ${OPTIONS}"
        }

      }
    }
  }
  post {
    success {
      script {
        GIT_COMMIT_EMAIL = sh(returnStdout: true, script: 'git --no-pager show -s --format=%ae').trim()
        mail(subject: "Successful Build: Bundle '${currentBuild.fullDisplayName}'", body: 'Congrats, your recent bundle build was successful! It is now available in Amazon S3.', to: "${GIT_COMMIT_EMAIL}", from: "KD Jenkins")
      }
    }

    failure {
     script {
      GIT_COMMIT_EMAIL = sh(returnStdout: true, script: 'git --no-pager show -s --format=%ae').trim()
        mail(subject: "Failed Build: Bundle '${currentBuild.fullDisplayName}'", body: 'There were errors found in your recent bundle build. Check the Jenkins job or run the tests to see what failed before attempting to build again.', to: "${GIT_COMMIT_EMAIL}", from: "KD Jenkins")
     }
    }
  }
}
