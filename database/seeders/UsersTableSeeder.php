<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Generator as Faker;
class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @param Faker $faker
     * @return void
     */
    public function run(Faker $faker)
    {
        $currencies = Currency::all();
        for ($i=0; $i<30; $i++){
            User::create([
                'name' => $faker->name,
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'email' => $faker->email,
                'amount' => rand(1000, 10000),
                'currency_id' => $currencies[rand(0, count($currencies) - 1)]->id,
                'password' => 'password'
            ]);
        }
    }
}
