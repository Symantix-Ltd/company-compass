// src/app/components/Insights.js
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { parseStringPromise } from 'xml2js';

async function getPosts() {
  const mediumRssUrl = "https://medium.com/feed/@companycompass";

  try {
    const res = await fetch(mediumRssUrl, { cache: 'no-cache' });
    const xml = await res.text();

    const parsed = await parseStringPromise(xml);
    const items = parsed.rss.channel[0].item;

    return items.slice(0, 10).map(item => ({
      guid: item.guid[0]._,
      title: item.title[0],
      content: item['content:encoded'][0],
    }));
  } catch (err) {
    console.error("Failed to fetch or parse posts:", err);
    return [];
  }
}

export default async function Insights() {
  const posts = await getPosts();

  return (
    <Container
      id="insights"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // center cards horizontally
        py: 4,
      }}
    >
      <Grid
        container
        spacing={3}
        direction="column" // stack items vertically
        alignItems="center" // center items
      >
        {posts.map((post) => (
          <Grid item key={post.guid} sx={{ width: '100%', maxWidth: 600 }}>
            <Card
              variant="outlined"
              sx={{
                width: '100%', // full width of grid item
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardHeader title={post.title} />
              <CardContent>
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  style={{ overflow: 'hidden' }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
