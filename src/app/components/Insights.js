// src/app/components/Insights.js

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';



/**
 * Fetch posts from Medium via RSS2JSON API.
 * @returns {Promise<Array<{ guid: string, title: string, content: string }>>}
 */
async function getPosts() {
  const mediumRssUrl = "https://medium.com/feed/@companycompass";
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${mediumRssUrl}&_=${Date.now()}`;

  try {
    const res = await fetch(apiUrl, { cache: 'no-cache' }); // SSG-style caching
    const data = await res.json();
    return data.items.slice(0, 10);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return [];
  }
}

export default async function Insights() {
  const posts = await getPosts();

  return (
    <Container
      id="insights"
      sx={{
       
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
       
      }}
    >
     
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={6} key={post.guid} sx={{ display: 'flex' }}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
              <CardHeader title={post.title} />
              <CardContent>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
