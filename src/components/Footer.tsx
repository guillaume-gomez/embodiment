import GithubButton from "./GithubButton";

interface FooterProps {
  githubRepositoryUrl: string;
}

function Footer({ githubRepositoryUrl }: FooterProps) {
  return (
    <footer className="footer items-center p-4">
      <div className="items-center grid-flow-col">
        <p>Made by Guillaume Gomez - 2023</p>
      </div> 
    </footer>
  )
}

export default Footer;
