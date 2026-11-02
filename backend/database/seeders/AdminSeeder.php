<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Maximal Construction',
            'email' => 'admin@maximalconstruction.com',
            'phone' => '081325255005',
            'address' => 'Dagen, Jaten, Karanganyar, Jawa Tengah',
            'password' => Hash::make('admin12345'),
            'role' => 'admin',
            'is_active' => true,
        ]);
    }
}