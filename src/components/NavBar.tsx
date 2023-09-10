
function NavBar() {
    return (
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Embodiment</a>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-accent">
                  Github
              </label>
            </div>
        </div>
    </div>
    );
}

export default NavBar;