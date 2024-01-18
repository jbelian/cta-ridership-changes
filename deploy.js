import ghpages from 'gh-pages';

ghpages.publish(
    'dist',
    {
        branch: 'gh-pages',
        repo: `https://${process.env.GITHUB_TOKEN}@github.com/jbelian/cta-ridership-changes.git`,
        user: {
            name: 'GitHub Actions',
            email: 'actions@users.noreply.github.com'
        }
    },
    err => {
        if (err) console.error('Failed to deploy:', err);
        else console.log('Deployed successfully');
    }
);