const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(
    'dist',
    {
        branch: 'gh-pages',
        repo: `https://${process.env.GITHUB_TOKEN}@github.com/jbelian/cta-ridership-changes.git`,
        user: {
            name: 'jbelian',
            email: 'jbelian@users.noreply.github.com'
        }
    },
    err => {
        if (err) console.error('Failed to deploy:', err);
        else console.log('Deployed successfully');
    }
);