module.exports = {
    branches: ['main'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/npm',
        '@semantic-release/github',
        [
            '@semantic-release/git',
            {
                assets: ['CHANGELOG.md', 'packages/*/package.json'],
                message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],
    ],
    tagFormat: '${name}@${version}',
    monorepo: {
        analyzeCommits: {
            preset: 'conventionalcommits',
            releaseRules: [
                { type: 'feat', release: 'minor' },
                { type: 'fix', release: 'patch' },
                { type: 'docs', release: 'patch' },
                { type: 'style', release: 'patch' },
                { type: 'refactor', release: 'patch' },
                { type: 'perf', release: 'patch' },
                { type: 'test', release: 'patch' },
            ],
        },
        packageDirs: ['packages/*'],
    },
};
