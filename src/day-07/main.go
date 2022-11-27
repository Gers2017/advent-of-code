package main

import (
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

func main() {
	content, err := os.ReadFile("input.txt")
	if err != nil {
		fmt.Println("Missing input")
		return
	}

	positions := parse_input(string(content))

	// positions := []int{16, 1, 2, 0, 4, 2, 7, 1, 2, 14}

	min_fuel, pos := get_min_fuel_and_pos(positions, true)
	fmt.Println(min_fuel, pos)
}

func parse_input(text string) []int {
	positions := []int{}
	for _, s := range strings.Split(text, ",") {
		x, err := strconv.Atoi(s)
		if err != nil {
			panic("Invalid value, not a number")
		}
		positions = append(positions, x)
	}
	return positions
}

func get_min_fuel_and_pos(positions []int, is_part2 bool) (int, int) {
	max_pos_x := 0
	for _, x := range positions {
		if x > max_pos_x {
			max_pos_x = x
		}
	}

	min_fuel := 100000000
	result_target := -1

	for target := 0; target < max_pos_x; target++ {
		var fuel int
		if is_part2 {
			fuel = get_total_increasing_fuel(target, positions)
		} else {
			fuel = get_total_constant_fuel(target, positions)
		}
		if fuel < min_fuel {
			min_fuel = fuel
			result_target = target
		}
	}

	return min_fuel, result_target
}

func get_total_constant_fuel(target int, positions []int) int {
	fuel_used := 0
	for _, x := range positions {
		if target == x {
			continue
		}
		distance := int(math.Abs(float64(target) - float64(x)))
		fuel_used += distance
	}

	return fuel_used
}

func get_total_increasing_fuel(target int, positions []int) int {
	total_fuel := 0
	for _, x := range positions {
		if target == x {
			continue
		}

		total_fuel += get_increasing_fuel(target, x)
	}

	return total_fuel
}

func get_increasing_fuel(from, to int) int {
	total_fuel := 0
	cost := 1

	for i := int(math.Min(float64(from), float64(to))); i < int(math.Max(float64(from), float64(to))); i++ {
		total_fuel += cost
		cost += 1
	}
	return total_fuel
}
