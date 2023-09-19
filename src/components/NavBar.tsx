import GithubButton from "./GithubButton";


interface NavBarProps {
  projectTitle: string;
  githubRepositoryUrl: string;
}

function NavBar({projectTitle, githubRepositoryUrl} : NavBarProps) {
    return (
        <div className="navbar bg-neutral">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">{projectTitle}</a>
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