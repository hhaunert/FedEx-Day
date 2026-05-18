create extension if not exists "uuid-ossp";

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

create table clippings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  image_url text,
  newspaper_name text,
  newspaper_date text,
  newspaper_page text,
  transcription text,
  user_details text,
  selected_story_types text[],
  clue_report jsonb,
  story_path jsonb,
  research_trail jsonb,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

create table story_types (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  ai_prompt text,
  sort_order int default 0,
  active boolean default true
);

create table content (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text not null,
  updated_at timestamp with time zone default now()
);

create table ai_prompts (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  description text,
  system_prompt text not null,
  updated_at timestamp with time zone default now()
);

alter table profiles enable row level security;
alter table clippings enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can view own clippings" on clippings for select using (auth.uid() = user_id);
create policy "Users can insert own clippings" on clippings for insert with check (auth.uid() = user_id);
create policy "Users can update own clippings" on clippings for update using (auth.uid() = user_id);

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Seed story types
insert into story_types (slug, name, description, ai_prompt, sort_order) values
('ancestor-life', 'The Ancestor Life Story', 'Reconstruct your ancestor''s life narrative from clues in the clipping', 'You are a genealogy storyteller. Based on the newspaper clipping transcription and clue report provided, write a compelling narrative about this ancestor''s life. Draw on historical context, social norms of the era, and details gleaned from the article to paint a vivid picture of who this person was and what their daily life might have been like. Write in a warm, engaging style that brings the ancestor to life for modern readers.', 1),
('place-story', 'The Place Story', 'Explore the location where your ancestor lived and the community they were part of', 'You are a local historian and genealogy researcher. Based on the newspaper clipping transcription and clue report provided, write a story about the place where this event occurred. Describe what the community was like, the geography, the local culture, and how the place has changed over time. Help the reader understand the world their ancestor inhabited.', 2),
('historical-context', 'The Historical Context Story', 'Situate the clipping within the broader historical events of the era', 'You are a historian specializing in genealogy research. Based on the newspaper clipping transcription and clue report provided, write about the historical context surrounding this clipping. What major events were happening nationally and internationally? How did these broader forces shape the lives of ordinary people like the ancestor in this clipping? Provide rich historical context that helps readers understand the era.', 3),
('day-in-the-life', 'The "Day in the Life" Story', 'Imagine and reconstruct what a typical day was like for your ancestor', 'You are a social historian and genealogy storyteller. Based on the newspaper clipping transcription and clue report provided, reconstruct what a typical day in the life of this ancestor might have looked like. Draw on historical records about daily life, occupations, social customs, and technology of the era to create an immersive, vivid account of ordinary life in this time and place.', 4),
('timeline', 'The Timeline Story', 'Build a timeline of key events in your ancestor''s life', 'You are a genealogy researcher. Based on the newspaper clipping transcription and clue report provided, construct a timeline of key events in this ancestor''s life. Include the event from the clipping as an anchor point, and extrapolate likely life events based on their age, occupation, and family details mentioned. Format as a clear chronological timeline with dates and descriptions.', 5),
('evidence', 'The Evidence Story', 'Analyze the clipping as genealogical evidence and assess its research value', 'You are a professional genealogist specializing in document analysis. Based on the newspaper clipping transcription and clue report provided, analyze this clipping as a piece of genealogical evidence. Assess its reliability, identify direct and indirect evidence, note what it proves versus what it suggests, and explain how it fits into a broader research strategy. Be thorough and methodical.', 6),
('life-moment', 'The Life Moment Story', 'Focus on this single moment in time and its significance to the ancestor', 'You are a genealogy storyteller with a gift for bringing singular moments to life. Based on the newspaper clipping transcription and clue report provided, write a focused, intimate narrative about this specific moment in your ancestor''s life. What were they feeling? What led up to this moment? What came after? Make this single event feel meaningful and real.', 7);

-- Seed default content
insert into content (key, value) values
('hero_headline', 'Uncover the Stories Hidden in Your Newspaper Clippings'),
('hero_subheadline', 'AI-powered analysis transforms old newspaper clippings into rich family histories, research trails, and compelling ancestor stories.'),
('cta_primary', 'Analyze a Clipping'),
('feature_clue_report_title', 'Clue Report'),
('feature_clue_report_desc', 'AI extracts people, dates, places, and relationships from your clipping into a structured research profile.'),
('feature_story_path_title', 'Story Path'),
('feature_story_path_desc', 'Choose from 7 story formats to transform raw clues into compelling narratives about your ancestor.'),
('feature_research_trail_title', 'Research Trail'),
('feature_research_trail_desc', 'Get actionable next steps: where to search next, name variants to try, and surrounding records to find.');

-- Seed default AI prompts
insert into ai_prompts (name, description, system_prompt) values
('clue_report', 'Extracts structured genealogical data from a newspaper transcription', 'You are an expert genealogist analyzing a newspaper clipping. Extract all genealogical clues from the provided transcription and return a structured JSON object with the following fields:
{
  "people": [{ "name": string, "role": string, "approximate_age": string, "relationship_to_subject": string }],
  "dates": [{ "date": string, "event": string, "certainty": "exact|approximate|inferred" }],
  "places": [{ "name": string, "type": "city|county|state|country|address|landmark", "context": string }],
  "relationships": [{ "person1": string, "person2": string, "relationship": string }],
  "occupations": [{ "person": string, "occupation": string }],
  "events": [{ "type": string, "description": string, "date": string, "location": string }],
  "key_facts": [string],
  "research_value": "high|medium|low",
  "notes": string
}
Be thorough and extract every possible genealogical detail.'),
('research_trail', 'Generates next research steps based on clue report and transcription', 'You are a professional genealogist creating a research plan. Based on the clue report and newspaper transcription provided, generate a comprehensive research trail in JSON format:
{
  "next_searches": [{ "record_type": string, "repository": string, "search_terms": string, "why": string, "priority": "high|medium|low" }],
  "surrounding_areas": [{ "location": string, "why_important": string, "records_to_check": [string] }],
  "name_variants": [{ "original": string, "variants": [string], "reason": string }],
  "time_period_tips": [string],
  "quick_wins": [string],
  "long_term_strategies": [string]
}
Be specific, actionable, and prioritize the most promising leads.');
