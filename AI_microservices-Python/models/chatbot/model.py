import torch
import torch.nn as nn

class ChatbotModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size, dropout=0.3):
        super(ChatbotModel, self).__init__()

        self.fc1 = nn.Linear(input_size, hidden_size)
        self.ln1 = nn.LayerNorm(hidden_size)
        self.act1 = nn.GELU()
        
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.ln2 = nn.LayerNorm(hidden_size)
        self.drop = nn.Dropout(dropout)
        self.act2 = nn.GELU()

        self.fc3 = nn.Linear(hidden_size, hidden_size)
        self.ln3 = nn.LayerNorm(hidden_size)
        self.act3 = nn.GELU()

        self.fc_out = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = self.fc1(x)
        x = self.ln1(x)
        x = self.act1(x)

        x = self.fc2(x)
        x = self.ln2(x)
        x = self.act2(x)
        x = self.drop(x)

        x = self.fc3(x)
        x = self.ln3(x)
        x = self.act3(x)

        out = self.fc_out(x)
        return out
