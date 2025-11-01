// Component loader utility
export async function loadComponent(componentName, containerId) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return null;
        }

        // Load component HTML
        const response = await fetch(`../components/${componentName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${response.statusText}`);
        }
        const html = await response.text();
        
        // Insert component HTML
        container.innerHTML = html;
        
        // Load component CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = `../components/${componentName}.css`;
        document.head.appendChild(cssLink);
        
        // Load and execute component JavaScript
        const script = document.createElement('script');
        script.src = `../components/${componentName}.js`;
        script.type = 'module';
        document.head.appendChild(script);
        
        console.log(`✅ Component ${componentName} loaded successfully`);
        return container;
        
    } catch (error) {
        console.error(`❌ Error loading component ${componentName}:`, error);
        return null;
    }
}
