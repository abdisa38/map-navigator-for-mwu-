<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $count = App\Models\Category::count();
    echo "Category Count: " . $count . "\n";
    
    if ($count == 0) {
        echo "Creating a category...\n";
        $cat = App\Models\Category::create(['name' => 'Test Category', 'slug' => 'test-category']);
        echo "Created category ID: " . $cat->id . "\n";
        $catId = $cat->id;
    } else {
        $catId = App\Models\Category::first()->id;
    }

    echo "Attempting to create a building with category_id: $catId\n";
    $building = App\Models\Building::create([
        'name' => 'Test Building',
        'category_id' => $catId,
        'latitude' => 10.0,
        'longitude' => 20.0,
        'description' => 'Test Desc',
        'image_url' => 'http://test.com/img.jpg'
    ]);
    echo "Building created successfully: ID " . $building->id . "\n";
    
    // Clean up
    $building->delete();
    echo "Building deleted.\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
