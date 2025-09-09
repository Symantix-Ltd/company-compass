'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import AdSlot from './AdSlot';

interface Post {
  guid: string;
  title: string;
  content: string;
}

interface InsightsProps {
  posts: Post[];
}

export default function Insights({ posts }: InsightsProps) {
  return (
    <Container id="insights" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
      <Grid container direction="column" alignItems="flex-start" spacing={2}>
        {posts.map((post) => (
          <div key={post.guid} style={{ width: '100%' }}>
            <Card variant="outlined" sx={{ width: '100%' }}>
              <CardHeader title={post.title} />
              <CardContent>
                <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ overflow: 'hidden' }} />
              </CardContent>
            </Card>

            <AdSlot
              format="auto"
              layout="-gh-5+1v-2l-d"
              client="ca-pub-7212919066729459"
              slot="4685100751"
            />
          </div>
        ))}
      </Grid>
    </Container>
  );
}
