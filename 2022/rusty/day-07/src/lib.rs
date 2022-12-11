pub struct Parser {
    lines: Vec<String>,
    index: usize,
}

pub enum CommandType {
    CD(String),
    LS,
}

impl Parser {
    pub fn new(lines: &[String]) -> Self {
        Parser {
            lines: lines.to_vec(),
            index: 0,
        }
    }

    pub fn peek(&self) -> String {
        self.lines[self.index].to_string()
    }

    pub fn advance(&mut self) {
        self.index += 1
    }

    pub fn is_at_end(&self) -> bool {
        self.index >= self.lines.len()
    }

    pub fn is_command(&self) -> bool {
        self.peek().starts_with("$")
    }

    pub fn is_dir(&self) -> bool {
        self.peek().starts_with("dir")
    }

    pub fn get_dir_name(&self) -> String {
        self.peek().replace("dir", "").trim().to_string()
    }

    pub fn get_file(&self) -> (String, u128) {
        let line = self.peek();
        let (size, name) = line.split_once(" ").expect("Invalid line");
        let size = size.parse::<u128>().expect("Invalid number");
        let name = name.to_string();
        (name, size)
    }

    pub fn get_command_type(&self) -> CommandType {
        if !self.is_command() {
            panic!("Invalid line {}, not a command", self.peek())
        }

        let mut line = self.peek();
        line = line.trim_start_matches("$ ").into();

        if line.starts_with("cd") {
            let (_, path) = line.split_once(" ").unwrap();
            CommandType::CD(path.to_string())
        } else {
            CommandType::LS
        }
    }
}

// Filesystem here...
pub struct FileSystem {
    pub current_id: usize,
    pub dirs: Vec<Dir>,
}

impl FileSystem {
    pub fn new() -> Self {
        let root = Dir::new(0 as usize, "/", None);
        FileSystem {
            current_id: root.id,
            dirs: vec![root],
        }
    }

    pub fn get_dir(&self, id: usize) -> &Dir {
        self.dirs.get(id).expect("Invalid id")
    }

    pub fn get_root_dir(&self) -> &Dir {
        &self.dirs[0 as usize]
    }

    pub fn set_to_root(&mut self) {
        self.current_id = 0 as usize
    }

    fn get_next_id(&self) -> usize {
        self.dirs.len()
    }

    pub fn get_current(&self) -> &Dir {
        self.dirs.get(self.current_id).expect("Unknown id")
    }

    pub fn get_current_mut(&mut self) -> &mut Dir {
        self.dirs.get_mut(self.current_id).expect("Unknown id")
    }

    pub fn move_up(&mut self) {
        let parent_id = self
            .get_current()
            .parent_id
            .expect("Directory has no parent");
        self.current_id = parent_id;
    }

    pub fn cd_into(&mut self, name: &str) {
        let sub_dir = self
            .get_current()
            .child_ids
            .iter()
            .map(|id| self.get_dir(*id))
            .find(|dir| dir.name == name);
        let sub_dir_id = sub_dir.map(|it| it.id).expect("No such directory");
        self.current_id = sub_dir_id
    }

    pub fn add_empty_dir(&mut self, name: &str) {
        let new_dir_id = self.get_next_id();
        let dir = Dir::new(new_dir_id, name, Some(self.current_id));
        self.get_current_mut().add_dir(new_dir_id);
        self.dirs.push(dir);
    }

    pub fn get_dir_size(&self, id: usize) -> u128 {
        let dir = self.get_dir(id);
        let children_size: u128 = dir
            .child_ids
            .iter()
            .map(|child_id| self.get_dir_size(*child_id))
            .sum();

        dir.get_size() + children_size
    }
}

pub struct File {
    pub name: String,
    pub size: u128,
}

impl File {
    pub fn new(name: &str, size: u128) -> Self {
        File {
            name: name.to_string(),
            size,
        }
    }
}

pub struct Dir {
    pub id: usize,
    pub parent_id: Option<usize>,
    pub name: String,
    pub files: Vec<File>,
    pub child_ids: Vec<usize>,
}

impl Dir {
    pub fn new(id: usize, name: &str, parent: Option<usize>) -> Self {
        Self {
            id,
            parent_id: parent,
            name: name.to_string(),
            files: vec![],
            child_ids: vec![],
        }
    }

    pub fn add_dir(&mut self, dir_id: usize) {
        self.child_ids.push(dir_id);
    }

    pub fn add_file(&mut self, f: File) {
        self.files.push(f);
    }

    pub fn get_size(&self) -> u128 {
        self.files.iter().map(|f| f.size).sum()
    }
}

pub fn traverse_dirs(dir: &Dir, fs: &FileSystem, dir_sizes: &mut Vec<u128>) {
    let size = fs.get_dir_size(dir.id);
    dir_sizes.push(size);

    for id in dir.child_ids.iter() {
        let dir = fs.get_dir(*id);
        traverse_dirs(dir, fs, dir_sizes)
    }
}

pub fn recreate_filesystem(lines: &[String]) -> FileSystem {
    use CommandType::*;
    let mut p = Parser::new(&lines);
    let mut fs = FileSystem::new();

    while !p.is_at_end() {
        if !p.is_command() {
            continue;
        }

        match p.get_command_type() {
            CD(path) => {
                if path == "/" {
                    fs.set_to_root();
                } else if path == ".." {
                    fs.move_up();
                } else {
                    fs.cd_into(&path);
                }

                p.advance()
            }
            LS => {
                p.advance();
                while !p.is_at_end() && !p.is_command() {
                    if p.is_dir() {
                        let d_name = p.get_dir_name();
                        fs.add_empty_dir(&d_name);
                    } else {
                        let (name, size) = p.get_file();
                        let file = File::new(&name, size);
                        fs.get_current_mut().add_file(file);
                    }

                    p.advance();
                }
            }
        }
    }

    fs
}

#[cfg(test)]
mod tests {
    use crate::CommandType::*;
    use crate::*;

    #[test]
    fn test_filesystem() {
        let mut fs = FileSystem::new();
        assert_eq!(fs.get_current().name, "/");

        // create dirs
        fs.add_empty_dir("foo");
        fs.add_empty_dir("bar");

        // change current dir
        fs.cd_into("foo");

        let foo = fs.get_current_mut();
        let foo_id = foo.id;
        assert_eq!(foo.name, "foo");

        foo.add_file(File::new("foo.txt", 128));
        assert!(foo.files.len() > 0);

        // add empty dirs
        fs.add_empty_dir("rat");
        fs.cd_into("rat");
        fs.add_empty_dir("qwerty");
        fs.cd_into("qwerty");
        fs.get_current_mut().add_file(File::new("foo2.txt", 128));

        // get size of foo
        let foo_size = fs.get_dir_size(foo_id);
        assert_eq!(foo_size, 256u128);

        // cd .. to root
        fs.move_up();
        fs.move_up();
        fs.move_up();
        assert_eq!(fs.get_current().name, "/");
        assert_eq!(fs.get_root_dir().name, "/");
    }

    const SMALL_INPUT: &str = r#"$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat"#;

    #[test]
    fn test_parser() {
        let lines: Vec<String> = SMALL_INPUT.lines().map(|s| s.to_string()).collect();
        let mut p = Parser::new(&lines);
        let mut contents = vec![];
        while !p.is_at_end() {
            if !p.is_command() {
                continue;
            }

            match p.get_command_type() {
                CD(_path) => p.advance(),
                LS => {
                    p.advance();

                    while !p.is_at_end() && !p.is_command() {
                        if p.is_dir() {
                            let dir_name = p.get_dir_name();
                            contents.push(dir_name)
                        } else {
                            let (name, _size) = p.get_file();
                            contents.push(name);
                        }

                        p.advance();
                    }
                }
            }
        }

        let expected = vec!["a", "b.txt", "c.dat"];
        for (i, got) in contents.iter().enumerate() {
            assert_eq!(got.as_str(), expected[i]);
        }
    }

    #[test]
    fn test_solution() {
        let text = include_str!("../input_test.txt");
        let lines: Vec<String> = text.lines().map(|s| s.to_string()).collect();
        let fs = recreate_filesystem(&lines);

        let mut dir_sizes: Vec<u128> = vec![];
        traverse_dirs(fs.get_root_dir(), &fs, &mut dir_sizes);
        let total: u128 = dir_sizes.iter().filter(|x| **x <= 100000u128).sum();
        assert_eq!(total, 95437u128);
    }
}
