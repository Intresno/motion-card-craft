
import { registerRoot } from 'remotion';
import { ShortsTemplate } from './ShortsTemplate';

// Register the template
registerRoot({
  // Each template gets a unique ID
  'shorts_template_1': ({ scenes }) => <ShortsTemplate scenes={scenes} />
});
