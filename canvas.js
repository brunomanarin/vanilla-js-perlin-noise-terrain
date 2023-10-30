let x = 0;
let y = 0;

const canvasWidth = 500;
const canvasHeight = 500;

const chunkWidth = 500;
const chunkHeight = 500;

let currentChunkNumber = 0;

const gridSize = 5;
const numCols = canvasWidth / gridSize;
const numRows = canvasHeight / gridSize;

const chunks = [
];

console.log(noise);




function draw() {
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d");
        
        handleChunks(ctx);
        renderChunk(chunks[currentChunkNumber], ctx);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(x, y, 20, 20);

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "20px Arial";
 
        const text = `${currentChunkNumber}`;
        const textWidth = ctx.measureText(text).width;
        const centerX = (canvas.width - textWidth);
        const centerY = canvas.height;
 
        ctx.fillText(text, centerX, centerY);

        drawQuadrantTable(ctx);
        
    }

    
    
    window.requestAnimationFrame(draw);
}

function drawQuadrantTable(ctx) {
    const gridSize = 20;
    const numCols = canvasWidth / gridSize;
    const numRows = canvasHeight / gridSize;

    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;

    for (let i = 0; i < numCols; i++) {
        const x = i * gridSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
    }

    for (let j = 0; j < numRows; j++) {
        const y = j * gridSize;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

function handleChunks(){
    if(currentChunkNumber === 0){
        generateNewChunk();
    }

    if(x > chunkWidth){
        if(!chunks[currentChunkNumber+1]){
            x = chunkWidth - 20;
            return;
        }
        generateNewChunk();
        currentChunkNumber +=1;
        x = 0;
        
    }

    if(y > chunkHeight){
        if(!chunks[currentChunkNumber+1]){
            y = chunkHeight - 20;
            return;
        }
        generateNewChunk();
        currentChunkNumber +=1;
        y = 0;
        
    }

    if(x < 0){
        if(!chunks[currentChunkNumber-1]){
            x = 0;
            return;
        }
        currentChunkNumber -=1;
        x = chunkWidth;
    }

    if(y < 0){
        if(!chunks[currentChunkNumber-1]){
            y = 0;
            return;
        }
        currentChunkNumber -=1;
        y = chunkWidth;
    }
}

function generateNewChunk () {
    const newChunk = {
        chunkName: `${Math.random()}`,
        chunkTiles: [],
    };

    generateChunkTiles(newChunk);

    chunks.push(newChunk);
}

function generateChunkTiles (chunk) {
    noise.seed(Math.random());
    for (let i = 0; i < numCols; i++) {
        chunk.chunkTiles.push([]);
        for (let j = 0; j < numRows; j++) {
            const perlinValue = noise.perlin2(i * 0.05, j * 0.05);
            const terrainType = getTerrainType(perlinValue);
            chunk.chunkTiles[i].push(terrainType);
        }
    }
}

function getTerrainType(value) {
    const thresholds = [
        { threshold: -0.2, color: "#87CEEB", type: "water" },
        { threshold: 0.4, color: "#228B22", type: "grass" },
        { threshold: 0.6, color: "#F5E1AA", type: "sand" },
        { threshold: 1.0, color: "#8B4513", type: "dirt" },
    ];

    for (const threshold of thresholds) {
        if (value < threshold.threshold) {
            return { color: threshold.color, type: threshold.type };
        }
    }

    // Default case
    return { color: "#8B4513", type: "dirt" };
}

function renderChunk(chunk, ctx){
    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            const x = i * gridSize;
            const y = j * gridSize;

            ctx.fillStyle = chunk.chunkTiles[i][j].color;
            
            ctx.fillRect(x, y, gridSize, gridSize)
        }
    }
}

function handleKeyPress(event) {
    const speed = 20;

    directions = {
        ArrowUp: ()=> y -= speed,
        ArrowDown: () =>y += speed,
        ArrowLeft: () =>x -= speed,
        ArrowRight: ()=>x += speed
    }

    if(!directions[event.key]) return;

    return directions[event.key]();
}



window.addEventListener("load", () => {
    window.addEventListener("keydown", handleKeyPress);
});

draw();