<?php

namespace Modules\Peminjaman\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Buku\Models\Buku;
use Modules\Peminjaman\Models\Peminjaman;

class PeminjamanDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = fake('id_ID');
        $judul = Buku::pluck('judul');

        for ($i = 0; $i < 12; $i++) {
            $pinjam = $faker->dateTimeBetween('-30 days', 'now');

            Peminjaman::create([
                'nama_peminjam' => $faker->name(),
                'judul_buku' => $judul->random(),
                'tanggal_pinjam' => $pinjam->format('Y-m-d'),
                'tanggal_kembali' => (clone $pinjam)->modify('+7 days')->format('Y-m-d'),
                'status' => $faker->randomElement(['Dipinjam', 'Dikembalikan']),
                'bukti' => null,
            ]);
        }
    }
}