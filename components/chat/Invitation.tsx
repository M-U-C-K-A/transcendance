


export function MessageInput({ value, onChange, onSubmit, placeholder = "Écrivez un message..." }: MessageInputProps) {
	return (
	  <form onSubmit={onSubmit} className="flex gap-2 p-4">
		<Invitation
  
		/>
		<Input
		  placeholder={placeholder}
		  value={value}
		  onChange={(e) => onChange(e.target.value)}
		  className="flex-1"
		/>
		<Button type="submit" size="icon" aria-label="Send message">
		  <Send className="h-4 w-4" />
		</Button>
	  </form>
	)
  }


  // bouton petit qui permet d invite dans une partie

  // si on se trouver deja de dedans. 

  // 
