namespace Checkers.Service.Model
{
    public class Move
    {
        public Move()
        {
            this.From = string.Empty;
            this.To = string.Empty;
        }

        public Move(Checkers.Move move)
        {
            this.Color = move.Color;
            this.From = move.From.ToString();
            this.To = move.To.ToString();
        }

        public Color Color { get; set; }

        public string From { get; set; }

        public string To { get; set; }

        public Checkers.Move ToMove()
        {
            return new Checkers.Move(this.Color, Location.FromString(this.From), Location.FromString(this.To));
        }
    }
}
