import { Button, TextField, Card, Select, SelectItem, DatePicker, TimeField } from "@noria/ui";
import { Star, Trash2, Home as HomeIcon, CheckCircle, Search, Mail } from "lucide-react";

const Home = () => {
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

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Cards</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Card style={{ gap: '1.5rem', width: '320px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Sign In</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <TextField label="Email Address" placeholder="hello@noria.app" startIcon={<Mail />} />
              <TextField label="Password" type="password" placeholder="••••••••" />
            </div>
            <Button variant="primary" style={{ marginTop: '0.5rem', width: '100%' }}>Login</Button>
          </Card>

          <Card as="a" href="#" style={{ gap: '1rem', width: '320px', textDecoration: 'none' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} />
              Interactive Layout
            </h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              This entire card acts as a link. It elevates on hover to indicate interactivity while maintaining our neumorphic aesthetic.
            </p>
          </Card>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Date & Time</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '600px', flexDirection: 'column' }}>
          <DatePicker label="Event Date" />
          <TimeField label="Start Time" hourCycle={24} />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>Select (Dropdown)</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '300px', flexDirection: 'column' }}>
          <Select label="Frequency">
            <SelectItem id="daily">Daily</SelectItem>
            <SelectItem id="weekly">Weekly</SelectItem>
            <SelectItem id="monthly">Monthly</SelectItem>
          </Select>
        </div>
      </section>
    </div>
  );
}
export default Home;
