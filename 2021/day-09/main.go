package main

import (
	"fmt"
	"os"
	"sort"
	"strings"
)

type Point = [2]int

var dirs = [4]Point{{1, 0}, {0, 1}, {-1, 0}, {0, -1}}

func main() {
	content, err := os.ReadFile("input.txt")
	if err != nil {
		fmt.Println("Missing input")
		return
	}

	board := string(content)

	rows := [][]int{}
	for _, row := range strings.Split(board, "\n") {
		numbers := []int{}
		for _, char := range row {
			n := int(char - '0')
			numbers = append(numbers, n)
		}

		rows = append(rows, numbers)
	}

	lowestInAll := []int{}
	basins := [][]int{}

	for y, row := range rows {
		for x, n := range row {
			// DFS
			isLowest := isLowestPoint(rows, x, y)
			if isLowest {
				lowestInAll = append(lowestInAll, n+1) // Risk map
				basin := getBasin(x, y, rows)
				basins = append(basins, basin)
			}
		}
	}

	total := 0
	for _, n := range lowestInAll {
		total += n
	}

	fmt.Println("Part1 Sum of risk levels:", total)

	sort.Slice(basins, func(i, j int) bool {
		return len(basins[i]) > len(basins[j])
	})

	largestSum := len(basins[0]) * len(basins[1]) * len(basins[2])
	fmt.Println("Part2 Multiplication of top three largest basins:", largestSum)
}

func isLowestPoint(rows [][]int, x int, y int) bool {
	current := rows[y][x]
	row := rows[0]

	for _, dir := range dirs {
		dx, dy := dir[0], dir[1]
		nx, ny := x+dx, y+dy

		if nx < 0 || nx >= len(row) || ny < 0 || ny >= len(rows) {
			continue
		}

		other := rows[ny][nx]
		if other <= current {
			return false
		}
	}

	return true
}

func getBasin(x int, y int, rows [][]int) []int {
	seen := make(map[Point]bool, 0)
	points := []int{}
	points = append(points, rows[y][x])
	seen[[2]int{x, y}] = true

	explore(x, y, rows, seen, &points)

	return points
}

func explore(x, y int, rows [][]int, seen map[Point]bool, points *[]int) {
	for _, dir := range dirs {
		nx, ny := x+dir[0], y+dir[1]

		if nx < 0 || nx >= len(rows[0]) || ny < 0 || ny >= len(rows) {
			continue
		}

		otherValue := rows[ny][nx]
		otherPoint := [2]int{nx, ny}

		if seen[otherPoint] || otherValue >= 9 {
			continue
		}

		*points = append((*points), otherValue)
		seen[otherPoint] = true

		explore(nx, ny, rows, seen, points)
	}
}
