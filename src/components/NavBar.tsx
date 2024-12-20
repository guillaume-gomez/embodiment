import GithubButton from "./GithubButton";


interface NavBarProps {
  projectTitle: string;
  githubRepositoryUrl: string;
}

function NavBar({projectTitle, githubRepositoryUrl} : NavBarProps) {
    return (
        <div className="navbar p-0">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-4xl md:text-5xl font-regular">{projectTitle}</a>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <GithubButton githubRepositoryUrl={githubRepositoryUrl} />
            </div>
        </div>
    </div>
    );
}

export default NavBar;