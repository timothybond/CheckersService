namespace Checkers.Service.Model
{
    public class GameMove
    {
        public GameMove()
        {
            this.From = string.Empty;
            this.To = string.Empty;
        }

        public GameMove(Move move)
        {
            this.Color = move.Color;
            this.From = move.From.ToString();
            this.To = move.To.ToString();
        }

        public Color Color { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public Move ToMove()
        {
            return new Move(this.Color, Location.FromString(this.From), Location.FromString(this.To));
        }
    }
}
