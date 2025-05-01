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
            Welcome to our haunted data exploration! This dashboard dives into eerie trends in paranormal sightings
            across the United States, including UFO shapes, apparition types, and ghostly patterns. Click below to
            uncover the strange and supernatural.
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
              This map displays the number of haunted sightings by state across the U.S. Darker shades indicate a higher count. Patterns suggest a regional concentration in areas with older settlements or cultural significance.
            </p>
          </section>

          <section className="vis-section">
            <Heatmap />
            <p className='vis-desc'>
              This heat map shows the relationship between reported UFO shapes and apparition types. Notice how circular UFOs often align with ghostly human-like figures, suggesting potential perceptual bias.
            </p>
          </section>

          <section className="vis-section">
            <Network />
            <p className='vis-desc'>
              The network graph connects co-occurring features from haunted locations. Clusters of paranormal terms indicate common themes or repeated witness patterns.
            </p>
          </section>

          <section className="vis-section">
            <Scatter />
            <p className='vis-desc'>
              This scatter plot visualizes the distribution of haunting severity versus number of witness reports. We can see that more intense events tend to be correlated with a higher number of reports.
            </p>
          </section>

          <section className="vis-section">
            <Violin />
            <p className='vis-desc'>
              The violin plot compares the frequency of hauntings by state with the distribution of reported feature counts. States with higher counts tend to show wider spread, possibly due to population density or tourism.
            </p>
          </section>

          <section className="vis-section">
            <Bubble />
            <p className='vis-desc'>
              Bubble sizes indicate the number of reported haunted events in each county. This map provides a localized view into concentrated paranormal activity zones.
            </p>
          </section>

          <section className="vis-section">
            <Word />
            <p className='vis-desc'>
              Common words extracted from haunted site descriptions. Themes like “cold”, “presence”, and “shadow” are frequent, reflecting shared emotional and sensory cues across reports.
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