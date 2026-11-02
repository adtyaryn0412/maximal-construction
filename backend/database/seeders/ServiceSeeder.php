<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Pemasangan Kanopi',
                'description' => 'Pembuatan kanopi baja ringan, galvalum, atau besi hollow untuk garasi dan teras dengan desain modern dan awet.',
            ],
            [
                'name' => 'Pembuatan Pagar',
                'description' => 'Jasa las pembuatan pagar minimalis, klasik, hingga industrial menggunakan material besi berkualitas dan finishing anti karat.',
            ],
            [
                'name' => 'Bangun Rumah & Kost',
                'description' => 'Layanan pemborong profesional untuk pembangunan rumah tinggal atau kost dari nol hingga terima kunci.',
            ],
            [
                'name' => 'Renovasi Bangunan',
                'description' => 'Perbaikan atau perombakan ruko, kantor, dan rumah dengan perhitungan biaya yang transparan dan hasil presisi.',
            ],
            [
                'name' => 'Home Accessories',
                'description' => 'Pembuatan aksesoris rumah berbahan besi seperti railing tangga, teralis jendela, dan balkon.',
            ],
            [
                'name' => 'Konstruksi Baja',
                'description' => 'Pengerjaan konstruksi baja berat untuk gudang, pabrik, atau gedung dengan standar keamanan tinggi.',
            ],
        ];

        foreach ($services as $service) {
            Service::create([
                'name' => $service['name'],
                'slug' => Str::slug($service['name']),
                'description' => $service['description'],
                'is_active' => true,
            ]);
        }
    }
}