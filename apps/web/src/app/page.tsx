import { Button, TextField } from "@noria/ui";
import { Star, Trash2, Home as HomeIcon, CheckCircle, Search, Mail } from "lucide-react";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', padding: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Noria UI Showcase</h1>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Button Variants</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" icon={<HomeIcon />}>Primary</Button>
          <Button variant="secondary" icon={<CheckCircle />}>Secondary</Button>
          <Button variant="danger" icon={<Trash2 />}>Danger</Button>
          <Button variant="icon-only" icon={<Star />} aria-label="Star" />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Button States (Hover / Press)</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="secondary">Interactive Button</Button>
          <Button variant="secondary" isDisabled>Disabled</Button>
        </div>
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Text Fields</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '600px', flexDirection: 'column' }}>
          <TextField
            label="Email Address"
            placeholder="example@noria.app"
            startIcon={<Mail />}
            description="We'll never share your email with anyone else."
          />
          <TextField
            label="Search"
            placeholder="Search events..."
            startIcon={<Search />}
          />
          <TextField
            label="Username"
            placeholder="johndoe"
            isInvalid
            errorMessage="Username is already taken."
          />
        </div>
      </section>
    </div>
  );
}
