export function sayTyping(typer){
    let user = typer
    this.typingTimeout && clearTimeout(this.typingTimeout);
    this.setStatePure({
        typing: true,
        typer: user.nickname
    });
    this.typingTimeout = setTimeout(() => {
        this.setStatePure({
            typing: false,
            typer: user.nickname
        });
        clearTimeout(this.typingTimeout)
    }, 1000);
}