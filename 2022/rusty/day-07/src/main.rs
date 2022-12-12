use day_07::{recreate_filesystem, traverse_dirs};
use rusty::*;

fn main() {
    let input = InputBuilder::new(InputMode::Real).lines();
    let fs = recreate_filesystem(&input);

    let mut dir_sizes: Vec<u128> = vec![];
    traverse_dirs(fs.get_root_dir(), &fs, &mut dir_sizes);

    let total: u128 = dir_sizes.iter().filter(|x| **x <= 100000u128).sum();
    println!("Part1: {}", total);

    let root_size = fs.get_dir_size(0);
    let unused_space = 70000000u128 - root_size;
    let delete_dir_size = 30000000u128 - unused_space;

    assert!(delete_dir_size > 0);

    let dir_to_delete = dir_sizes
        .iter()
        .filter(|size| **size >= delete_dir_size)
        .min()
        .expect("No valid directory");

    println!("Part2: {}", dir_to_delete);
}
