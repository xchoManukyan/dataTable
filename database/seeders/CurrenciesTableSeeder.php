<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrenciesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Currency::create([
            'value' => 'usd',
            'code' => 'USD',
            'title' => 'US Dollar'
        ]);
        Currency::create([
            'value' => 'eur',
            'code' => 'EUR',
            'title' => 'Euro'
        ]);
        Currency::create([
            'value' => 'gbp',
            'code' => 'GBP',
            'title' => 'Pound sterling'
        ]);
    }
}
