// src/app/components/Insights.js
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { parseStringPromise } from 'xml2js';

import truncate from 'html-truncate';

const TruncatedPost = ({ content }) => {
  // Truncate to first 100 words (approximately)
  const truncatedContent = truncate(content, 1000, { keepImageTag: true }); // 1000 chars roughly ~100 words

  return (
    <div
      dangerouslySetInnerHTML={{ __html: truncatedContent }}
      style={{ overflow: 'hidden' }}
    />
  );
};


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
      description: item.description[0],
      
    }));
  } catch (err) {
    console.error("Failed to fetch or parse posts:", err);
    return [];
  }
}

export default async function InsightsShort() {
  const posts = await getPosts();

  return (
    <Container
      id="insights"
 
    >
        
      <Grid
        container
        
        direction="column" // stack items vertically
        alignItems="left" // center items
      >
        {posts.map((post,index) => (
          <Grid item key={index} >
            <Card
              variant="outlined"

              className="width-max px-5 "

            >
              <CardHeader title={post.title} />
              <CardContent>
                

<a className="underline" href={"/newsletter#" + index }>{post.description}</a>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
