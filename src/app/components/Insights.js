// src/app/components/Insights.js
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { parseStringPromise } from 'xml2js';
import AdSlot from './AdSlot'

async function getPosts() {
  const substackRssUrl = "https://companycompass.substack.com/feed";

  try {
    const res = await fetch(substackRssUrl, { cache: 'no-cache' });
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
        py: 2,
      }}
    >
      <Grid
        container
        
        direction="column" // stack items vertically
        alignItems="left" // center items
      >
        {posts.map((post,index) => (
          <Grid item id={index} key={post.guid} sx={{ width: '100%' }}>
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
           

            <AdSlot format="fluid"
            layout="-gh-5+1v-2l-d"
            client="ca-pub-7212919066729459"
            slot="4685100751" />


            
          </Grid>
          
        ))}
      </Grid>
    </Container>
  );
}
