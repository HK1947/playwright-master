// Jenkinsfile
// Jenkins Pipeline for Playwright Tests
// Uses Declarative Pipeline syntax

pipeline {
    // Run on any available agent/node
    agent any

    // Pipeline-level options
    options {
        // Kill pipeline if it takes more than 45 minutes
        timeout(time: 45, unit: 'MINUTES')

        // Don't allow two pipelines to run at same time
        disableConcurrentBuilds()

        // Keep only last 20 builds (save disk space)
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
    }

    // Parameters — user can choose when running manually
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser(s) to run tests on'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['qa', 'staging'],
            description: 'Environment to test against'
        )
        string(
            name: 'TEST_GREP',
            defaultValue: '',
            description: 'Tag filter (e.g., @smoke, @regression)'
        )
    }

    // Environment variables available to all stages
    environment {
        CI = 'true'
        ENV = "${params.ENVIRONMENT}"
    }

    // STAGES — each stage is a step in the pipeline
    stages {

        // Stage 1: Install dependencies
        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
                // npm ci = clean install from package-lock.json
                // Faster and more reliable than npm install in CI
            }
        }

        // Stage 2: Install browsers
        stage('Install Browsers') {
            steps {
                script {
                    // Install only selected browser (saves time)
                    if (params.BROWSER == 'all') {
                        sh 'npx playwright install --with-deps chromium firefox webkit'
                    } else {
                        sh "npx playwright install --with-deps ${params.BROWSER}"
                    }
                }
            }
        }

        // Stage 3: Lint check
        stage('Lint Check') {
            steps {
                sh 'npm run lint'
            }
        }

        // Stage 4: Run tests
        stage('Run Tests') {
            steps {
                // Load credentials from Jenkins Credential Store
                withCredentials([
                    string(credentialsId: 'BANK_USERNAME', variable: 'BANK_USERNAME'),
                    string(credentialsId: 'BANK_PASSWORD', variable: 'BANK_PASSWORD')
                ]) {
                    script {
                        // Build the test command
                        def testCmd = 'npx playwright test'

                        // Add browser filter if not 'all'
                        if (params.BROWSER != 'all') {
                            testCmd += " --project=${params.BROWSER}"
                        }

                        // Add tag filter if provided
                        if (params.TEST_GREP?.trim()) {
                            testCmd += " --grep '${params.TEST_GREP}'"
                        }

                        // Run tests
                        sh testCmd
                    }
                }
            }
        }
    }

    // POST — runs after all stages (pass or fail)
    post {
        // ALWAYS — upload reports regardless of result
        always {
            // Archive HTML report
            archiveArtifacts(
                artifacts: 'playwright-report/**/*',
                allowEmptyArchive: true
            )

            // Archive test results (screenshots, videos, traces)
            archiveArtifacts(
                artifacts: 'test-results/**/*',
                allowEmptyArchive: true
            )

            // Publish JUnit results (shows in Jenkins UI)
            junit(
                testResults: 'results/junit-results.xml',
                allowEmptyResults: true
            )
        }

        // On SUCCESS
        success {
            echo '✅ All Playwright tests passed!'
        }

        // On FAILURE
        failure {
            echo '❌ Some tests failed. Check archived reports.'
        }

        // CLEANUP
        cleanup {
            cleanWs()
            // Cleans workspace after build — saves disk space
        }
    }
}