const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Events = Matter.Events;

const engine = Engine.create();
const world = engine.world;

engine.world.gravity.y = 0.9;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize(){

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

}

resize();

window.addEventListener("resize",resize);

const runner=Runner.create();

Runner.run(runner,engine);

console.log("Engine Loaded");