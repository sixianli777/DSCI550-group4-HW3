import React, { useState } from 'react';
import './App.css';
import Choropleth from './components/Choropleth';
import Heatmap from './components/Heatmap';
import Network from './components/Network';
import Scatter from './components/Scatter';
import Violin from './components/Violin';
import Bubble from './components/Bubble';
import Word from './components/Word';

function App() {
  const [showVisuals, setShowVisuals] = useState(false);
  const toggleVisuals = () => setShowVisuals(prev => !prev);

  return (
    <div className={`app-container ${showVisuals ? 'dashboard' : 'home'}`}>
      {/* Header */}
      <header className="header">
        DSCI 550 • Haunted Sightings Dashboard • Spring 2025
      </header>

      {/* Landing Page */}
      {!showVisuals && (
        <main className="main-content">
          <h1 className="title">🕯 Haunted Visualizations Dashboard</h1>
          <p className="intro">
            Welcome to our Haunted Visualizations Dashboard — your gateway into the eerie unknown.
            This dashboard uncovers chilling trends in paranormal activity reported across the United States. From spectral figures and haunted hotspots to unexplained UFO shapes and ghostly encounters, our visualizations reveal patterns that defy logic and stir curiosity. Dare to click below and explore the strange, the spectral, and the supernatural.
          </p>
          <button className="explore-btn" onClick={toggleVisuals}>Explore Visualizations</button>
        </main>
      )}

      {/* Visualizations Page */}
      {showVisuals && (
        <main className="visual-content">
          <button className="back-btn" onClick={toggleVisuals}>⬅ Back to Home</button>

          <section className="vis-section">
            <Choropleth />
            <p className='vis-desc'>
              The choropleth map visualizes the geographic distribution of haunted sightings across the United States by shading each state according to its total number of reports. States like California, Texas, and Pennsylvania appear darkest, indicating high volumes of reported hauntings. This regional clustering helps identify paranormal "hotspots" and provides a broad overview of where hauntings are most frequently observed. By offering a normalized state-level comparison, this map highlights how population density and cultural reporting patterns may influence sighting frequency.
            </p>
          </section>

          <section className="vis-section">
            <Heatmap />
            <p className='vis-desc'>
              The heat map displays co-occurrence patterns between UFO shapes and apparition types in haunted reports. Darker colors indicate higher frequencies, revealing strong associations—for instance, between “light”-shaped UFOs and “ghostly entities” or “unknown” apparitions. This visualization uncovers subtle but meaningful pairings that textual summaries might overlook. It helps explore whether specific UFO forms are more likely to be linked with certain supernatural encounters, suggesting underlying narrative or perceptual connections.
            </p>
          </section>

          <section className="vis-section">
            <Network />
            <p className='vis-desc'>
              This force-directed graph maps how place features, apparition types, and event types are connected based on how often they appear together. Locations like *church*, *prison*, and *barn* often co-occur with *death* events and *ghostly entities*, forming dense clusters, while rarer types like *extraterrestrial entities* appear more isolated. Dragging the nodes reveals how stories group together, making it easy to see which themes are central and which stand apart.
            </p>
          </section>

          <section className="vis-section">
            <Scatter />
            <p className='vis-desc'>
              This chart compares state-level alcohol use with haunted sighting rates per 100,000 residents. States like Wyoming and Vermont, which have higher drinking rates, also report more hauntings, while Utah falls on the low end of both. The trend isn’t perfect, but it suggests that alcohol use may play a role in how people report or perceive paranormal activity.
            </p>
          </section>

          <section className="vis-section">
            <Violin />
            <p className='vis-desc'>
              These plots show the full range and distribution of weather conditions—like humidity, cloud cover, wind gusts, and rain—across different witness-count groups. Reports tend to spike under high humidity and cloud cover, with little rain and moderate wind, suggesting that hauntings are most often reported in dim, muggy weather. It hints at a possible link between eerie environmental conditions and how people experience or interpret strange events.
            </p>
          </section>

          <section className="vis-section">
            <Bubble />
            <p className='vis-desc'>
              The bubble map presents haunted sightings by city, with circle size reflecting report volume. Unlike the choropleth, this visualization pinpoints local concentrations, revealing urban and community-level hotspots. California, New York, and Florida show dense clusters, suggesting that population centers or local lore may drive increased reporting. The map's granularity provides a more detailed view of haunting patterns than state-level aggregation.
            </p>
          </section>

          <section className="vis-section">
            <Word />
            <p className='vis-desc'>
              The word cloud visualizes the most common terms used in haunting reports, with word size representing frequency. Words like “people,” “seen,” “night,” and “ghost” dominate, reflecting core themes in witness narratives. Notably, the presence of terms like “school,” “cemetery,” and “basement” suggests recurring locations or motifs in paranormal events. This visualization offers a quick, intuitive way to grasp the content and tone of haunting accounts.
            </p>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="footer">
        © USC Data Science Group 2025. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;