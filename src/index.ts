import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  
  // CPU intensive test - Fibonacci calculation
  .get("/cpu/:n", ({ params }) => {
    const n = parseInt(params.n) || 35;
    const startTime = Date.now();
    
    function fibonacci(num: number): number {
      if (num <= 1) return num;
      return fibonacci(num - 1) + fibonacci(num - 2);
    }
    
    const result = fibonacci(n);
    const endTime = Date.now();
    
    return {
      input: n,
      result,
      executionTime: `${endTime - startTime}ms`,
      timestamp: new Date().toISOString()
    };
  })
  
  // Memory allocation test
  .get("/memory/:size", ({ params }) => {
    const sizeInMB = parseInt(params.size) || 10;
    const startTime = Date.now();
    
    // Allocate memory (size in MB)
    const arraySize = sizeInMB * 1024 * 1024 / 8; // 8 bytes per number
    const largeArray = new Array(arraySize).fill(Math.random());
    
    const endTime = Date.now();
    
    return {
      allocatedSizeMB: sizeInMB,
      arrayLength: largeArray.length,
      executionTime: `${endTime - startTime}ms`,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  })
  
  // JSON processing test
  .post("/json-process", ({ body }) => {
    const startTime = Date.now();
    
    // Create a large JSON object for processing
    const testData = {
      originalData: body,
      processedAt: new Date().toISOString(),
      largeArray: Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        timestamp: Date.now() + i
      }))
    };
    
    // Simulate JSON processing
    const serialized = JSON.stringify(testData);
    const parsed = JSON.parse(serialized);
    
    const endTime = Date.now();
    
    return {
      originalBodySize: JSON.stringify(body).length,
      processedDataSize: serialized.length,
      executionTime: `${endTime - startTime}ms`,
      itemsProcessed: parsed.largeArray.length,
      timestamp: new Date().toISOString()
    };
  })
  
  // Concurrent requests simulation
  .get("/concurrent/:delay", async ({ params }) => {
    const delay = parseInt(params.delay) || 100;
    const startTime = Date.now();
    
    // Simulate async operations
    const promises = Array.from({ length: 10 }, async (_, i) => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return {
        taskId: i,
        completedAt: Date.now()
      };
    });
    
    const results = await Promise.all(promises);
    const endTime = Date.now();
    
    return {
      delayPerTask: `${delay}ms`,
      tasksCompleted: results.length,
      totalExecutionTime: `${endTime - startTime}ms`,
      results,
      timestamp: new Date().toISOString()
    };
  })
  
  // System information endpoint
  .get("/system-info", () => {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };
  })
  
  // Load test endpoint - returns large response
  .get("/load-test/:size", ({ params }) => {
    const sizeInKB = parseInt(params.size) || 100;
    const startTime = Date.now();
    
    // Generate large response data
    const data = Array.from({ length: sizeInKB * 10 }, (_, i) => ({
      id: i,
      data: 'x'.repeat(100), // 100 chars per item
      timestamp: Date.now(),
      random: Math.random()
    }));
    
    const endTime = Date.now();
    
    return {
      requestedSizeKB: sizeInKB,
      actualItems: data.length,
      generationTime: `${endTime - startTime}ms`,
      data,
      timestamp: new Date().toISOString()
    };
  })
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
