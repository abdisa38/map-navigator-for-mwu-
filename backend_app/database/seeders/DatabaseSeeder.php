<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // specific admin user
        User::create([
            'name' => 'System Admin',
            'university_id' => 'admin01',
            'email' => 'admin@mwu.edu.et',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $this->call([
            CategorySeeder::class,
            BuildingSeeder::class,
            CampusBoundarySeeder::class,
        ]);
    }
}
