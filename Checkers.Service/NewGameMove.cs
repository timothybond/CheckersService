namespace Checkers.Service
{
    public class NewGameMove
    {
        public NewGameMove()
        {
            this.GameId = string.Empty;
            this.Moves = new GameMove[] { };
        }

        public string GameId { get; set; }

        public GameMove[] Moves { get; set; }
    }
}
